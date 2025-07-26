import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/user/schemas/User.schema';

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Actions, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.role === UserRole.Admin) {
      can('manage', 'all');
      // Cannot create user with the role Admin
      cannot('create', User, { role: UserRole.Admin });
    }
    if (user.role === UserRole.DepartmentManager) {
      // can create users with the same department id
      can('create', User, { dept_id: user.dept_id });
      can('update', User, { dept_id: user.dept_id });
    } else {
      can('read', User, { _id: user._id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
