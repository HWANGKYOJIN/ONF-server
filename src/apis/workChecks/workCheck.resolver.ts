import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { plusNineHour } from 'src/common/libraries/utils';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { CreateWorkCheckInput } from './dto/createWorkCheck.input';
import { UpdateWorkCheckInput } from './dto/updateWorkCheck.input';
import { WorkCheck } from './entities/workCheck.entity';
import { WorkCheckService } from './workCheck.service';

@Resolver()
export class WorkCheckResolver {
  constructor(
    private readonly workCheckService: WorkCheckService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [WorkCheck], {
    description: 'member개인(나)의 출퇴근 기록 조회 - 직원모드',
  })
  async fetchMemberWorkChecks(
    @Context() context: IContext, //
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    const result = await this.workCheckService.findMemberWorkCheck({
      memberId: context.req.user.member,
      startDate,
      endDate,
    });

    result.map((time) => {
      plusNineHour(time.workingTime), plusNineHour(time.quittingTime);
    });

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [[[WorkCheck]]], {
    description:
      '회사 지점에 속한 멤버들의 출퇴근 기록을 월별로 조회 - 달력형 - 관리자',
  })
  async fetchMonthWorkChecks(
    @Context() context: IContext, //
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('month') month: string,
  ) {
    const result = await this.workCheckService.findMonth({
      companyId: context.req.user.company,
      organizationId,
      month,
    });

    result.flat(2).map((time) => {
      plusNineHour(time.workingTime), plusNineHour(time.quittingTime);
    });

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [WorkCheck], {
    description:
      '지정된 기간동안의 회사+지점에 속한 멤버들의 출퇴근 기록 조회 - 목록형 - 관리자',
  })
  async fetchDateMemberWorkChecks(
    @Context() context: IContext, //
    @Args({ name: 'organizationId', type: () => [String], nullable: true })
    organizationId: string[],
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    return await this.workCheckService.findDateMemberWorkCheck({
      companyId: context.req.user.company,
      organizationId,
      startDate,
      endDate,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => WorkCheck, { description: '관리자용 출퇴근기록 생성하기' })
  async createAdminWorkCheck(
    @Context() context: IContext, //
    @Args('createWorkCheckInput') createWorkCheckInput: CreateWorkCheckInput,
  ) {
    return await this.workCheckService.createAdmin({
      companyId: context.req.user.company,
      createWorkCheckInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => WorkCheck, { description: '근무노트 생성' })
  async createWorkCheckMemo(
    @Args('workCheckId') workCheckId: string, //
    @Args('workCheckMemo') workCheckMemo: string,
  ): Promise<WorkCheck> {
    return await this.workCheckService.createMemo({
      workCheckId,
      workCheckMemo,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => WorkCheck, { description: '출근하기' })
  async createStartWorkCheck(
    @Context() context: IContext, //
  ) {
    const result = await this.workCheckService.createStartWork({
      memberId: context.req.user.member,
    });

    plusNineHour(result.workDay);
    plusNineHour(result.workingTime);

    return result;
  }

  // TODO : 파라미터로 뭘 줘야할지 고민해볼 문제,,,
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => WorkCheck, { description: '퇴근하기' })
  async createEndWorkCheck(
    @Args('workCheckId') workCheckId: string, //
  ) {
    const result = await this.workCheckService.createEndWork({ workCheckId });

    plusNineHour(result.workingTime);
    plusNineHour(result.quittingTime);

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => WorkCheck, { description: '출퇴근기록 단일 수정' })
  async updateOneWorkCheck(
    @Args('workCheckId') workCheckId: string, //
    @Args('updateWorkCheckInput') updateWorkCheckInput: UpdateWorkCheckInput,
  ) {
    const result = await this.workCheckService.updateOne({
      workCheckId,
      updateWorkCheckInput,
    });

    plusNineHour(result.workingTime);
    plusNineHour(result.quittingTime);

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => [WorkCheck], { description: '출퇴근기록 다수 수정' })
  async updateManyWorkCheck(
    @Args({ name: 'workCheckId', type: () => [String] }) workCheckId: string[],
    @Args('updateWorkCheckInput') updateWorkCheckInput: UpdateWorkCheckInput,
  ) {
    return await this.workCheckService.updateMany({
      workCheckId,
      updateWorkCheckInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '출퇴근기록 단일 삭제' })
  async deleteOneWorkCheck(
    @Args('workCheckId') workCheckId: string, //
  ) {
    return await this.workCheckService.deleteOne({ workCheckId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '출근기록 다수 삭제' })
  async deleteManyWorkCheck(
    @Args({ name: 'workCheckId', type: () => [String] }) workCheckId: string[], //
  ) {
    return await this.workCheckService.deleteMany({ workCheckId });
  }
}

// TODO 출퇴근기록 수정에서 지점,직무 수정할 때 관리 - 직원수정에서 지점,직무가 없음 이면 없음에서 다른걸로 수정안됨 설정해줘야 수정됨
