import { getRepository, Repository } from 'typeorm';

import Appointment from '../entities/Appointment';

import IApppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '../../../dtos/ICreateAppointmentDTO';
import { isThisSecond } from 'date-fns';

class AppointmentsRepository implements IApppointmentsRepository {

  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {

    const findApppointment = await this.ormRepository.findOne({
      where: { date: date },
    });

    return findApppointment;
  }

  public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
