import { createAppointmentHandler } from "../../../lib/appointment-route";
import { createProductionBookingDependencies } from "../../../lib/runtime";

export async function POST(request: Request) {
  try {
    const handler = createAppointmentHandler(createProductionBookingDependencies());
    return await handler(request);
  } catch {
    return Response.json(
      {
        success: false,
        code: "SERVER_ERROR"
      },
      { status: 500 }
    );
  }
}
