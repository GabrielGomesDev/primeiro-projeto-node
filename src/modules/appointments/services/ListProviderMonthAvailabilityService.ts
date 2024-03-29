import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getDaysInMonth, getDate } from 'date-fns'
// import IUsersRepository from '@modules/users/repositories/IUsersRepository';
// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {

    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month
    });

    const numberofDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from({ length: numberofDaysInMonth }, (_, index) => index + 1);

    const availability = eachDayArray.map(day => {

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
