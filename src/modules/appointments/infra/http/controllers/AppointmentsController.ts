import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    //TODO: Change this later, Insomnia is not passing the Date as a String.
    //const newdate = '2021-09-20 13:00:00';

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: date,
      provider_id,
      user_id,
    });

    return response.json(appointment);
  }
}
