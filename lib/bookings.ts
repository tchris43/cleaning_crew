import type { AppointmentApiResponse, CreateAppointmentRpcInput } from "../types/appointment";
import { BOOKING_CAPACITY, getTimeBlockForAppointmentTime, isBookableTimeSlot, isWithinBookingWindow } from "./slots";
import { parseAppointmentRequest } from "./validation";
import type { AppointmentRpcClient } from "./appointment-db";
import type { BookingEmailSender } from "./email";

export interface BookingServiceDeps {
  rpcClient: AppointmentRpcClient;
  emailSender: BookingEmailSender;
  now?: () => Date;
}

function validationError(errors: Array<{ path: string; message: string }>): AppointmentApiResponse {
  return {
    status: 400,
    body: {
      success: false,
      code: "VALIDATION_ERROR",
      errors
    }
  };
}

function serverError(): AppointmentApiResponse {
  return {
    status: 500,
    body: {
      success: false,
      code: "SERVER_ERROR"
    }
  };
}

export async function processAppointmentSubmission(input: unknown, deps: BookingServiceDeps): Promise<AppointmentApiResponse> {
  const parsed = parseAppointmentRequest(input);

  if (!parsed.success) {
    return validationError(parsed.errors);
  }

  const now = deps.now?.() ?? new Date();
  const timeBlock = getTimeBlockForAppointmentTime(parsed.data.appointmentTime);

  if (!timeBlock) {
    return validationError([
      {
        path: "appointmentTime",
        message: "Please select a valid appointment time."
      }
    ]);
  }

  if (!isWithinBookingWindow(parsed.data.appointmentDate, now)) {
    return validationError([
      {
        path: "appointmentDate",
        message: "Please select a booking date within the allowed window."
      }
    ]);
  }

  if (!isBookableTimeSlot(parsed.data.appointmentDate, parsed.data.appointmentTime, now)) {
    return validationError([
      {
        path: "appointmentTime",
        message: "Please select a future appointment time."
      }
    ]);
  }

  const rpcInput: CreateAppointmentRpcInput = {
    ...parsed.data,
    timeBlock,
    blockCapacitySnapshot: BOOKING_CAPACITY
  };

  const rpcResult = await deps.rpcClient.createAppointment(rpcInput);

  if (!rpcResult.success) {
    if (rpcResult.code === "BLOCK_FULL") {
      return {
        status: 409,
        body: {
          success: false,
          code: "BLOCK_FULL"
        }
      };
    }

    return serverError();
  }

  try {
    await deps.emailSender.sendOwnerNotification({
      ...rpcInput,
      appointmentId: rpcResult.appointmentId
    });
  } catch {
    void 0;
  }

  try {
    if (rpcInput.email && deps.emailSender.sendCustomerNotification) {
      await deps.emailSender.sendCustomerNotification({
        ...parsed.data,
        appointmentId: rpcResult.appointmentId
      });
    }
  } catch {
    void 0;
  }

  return {
    status: 200,
    body: {
      success: true,
      appointmentId: rpcResult.appointmentId
    }
  };
}

export function createBookingService(rpcClient: AppointmentRpcClient, emailSender: BookingEmailSender, now?: () => Date) {
  return {
    process: (input: unknown) => processAppointmentSubmission(input, { rpcClient, emailSender, now })
  };
}
