export type ServiceTier = "BASIC_REFRESH" | "DEEP_CLEAN" | "PREMIUM_RESTORE";

export type TimeBlock = "MORNING" | "AFTERNOON" | "EVENING";

export type AppointmentStatus = "booked" | "completed" | "cancelled";

export interface AppointmentRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceTier: ServiceTier;
  vehicleSize: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  addons?: string[];
}

export interface NormalizedAppointmentRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceTier: ServiceTier;
  vehicleSize: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  addons: string[];
}

export interface CreateAppointmentRpcInput extends NormalizedAppointmentRequest {
  timeBlock: TimeBlock;
  blockCapacitySnapshot: number;
}

export type CreateAppointmentRpcResult =
  | { success: true; appointmentId: string }
  | { success: false; code: "BLOCK_FULL" | "SERVER_ERROR" };

export type AppointmentApiSuccessResponse = {
  success: true;
  appointmentId: string;
};

export type AppointmentApiErrorCode =
  | "VALIDATION_ERROR"
  | "BLOCK_FULL"
  | "SERVER_ERROR";

export type AppointmentApiErrorResponse = {
  success: false;
  code: AppointmentApiErrorCode;
  errors?: Array<{ path: string; message: string }>;
};

export type AppointmentApiResponse =
  | {
      status: number;
      body: AppointmentApiSuccessResponse;
    }
  | {
      status: number;
      body: AppointmentApiErrorResponse;
    };
