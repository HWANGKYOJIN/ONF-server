import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVacationInput } from './dto/createVacation.input';
import { UpdateVacationInput } from './dto/updateVacation.input';
import { Vacation } from './entities/vacation.entity';
import { VacationService } from './vacation.service';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';

@Resolver()
export class VacationResolver {
  constructor(
    private readonly vacationService: VacationService, //
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Vacation], { description: '(관리자) 휴가 전체 조회' })
  async fetchVacations(@Context() context: IContext) {
    return await this.vacationService.findAll({
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Vacation], { description: '(관리자) 기간 내 휴가 조회' })
  async fetchVacationWithDate(
    @Args('vacationStart') vacationStart: Date,
    @Args('vacationEnd') vacationEnd: Date,
    @Context() context: IContext,
  ) {
    return await this.vacationService.findVacationWithDate({
      vacationStart,
      vacationEnd,
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => Vacation, { description: '(관리자) 휴가 ID를 통한 휴가 조회' })
  async fetchVacation(
    @Args('vacationId') vacationId: string, //
  ) {
    return await this.vacationService.findOne({ vacationId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Vacation], { description: '(관리자) 퇴사자와 함께 조회' })
  async fetchVacationWithDelete() {
    return await this.vacationService.findVacationWithDelete();
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => [Vacation], { description: '(관리자) 휴가관리 만들기' })
  async createVacation(
    @Args('createVacaionInput') createVacationInput: CreateVacationInput,
  ) {
    return await this.vacationService.create({ createVacationInput });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Vacation, { description: '(관리자) 휴가 수정하기' })
  async updateVacation(
    @Args('vacationId') vacationId: string,
    @Args('updateVacationInput') updateVacationInput: UpdateVacationInput,
  ) {
    return await this.vacationService.update({
      vacationId,
      updateVacationInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '(관리자) 휴가 삭제 - DB에는 유지' })
  async softdeleteVacation(
    @Args('vacationId') vacationId: string, //
  ) {
    return await this.vacationService.softdelete({ vacationId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '(관리자) 휴가 완전 삭제' })
  async deleteVacation(
    @Args('vacationId') vacationId: string, //
  ) {
    return await this.vacationService.delete({ vacationId });
  }
}
