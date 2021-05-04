import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns'
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({ provider_id, month, year, day }: IRequest): Promise<IResponse> {

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({ provider_id, day, month, year });

    const hourStart = 8;

    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + hourStart);

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => {
          console.log('hour', hour);
          console.log('getHours(appointment.date)', getHours(appointment.date));
          getHours(appointment.date) === hour
        }
      );
      if (hour === 14 || hour === 15) { console.log('#####FOUNDDDDDD', hasAppointmentInHour); }

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
      }
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
