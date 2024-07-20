import {AbilityBuilder, createMongoAbility} from '@casl/ability';

export default function defineAbilitiesFor(role) {
    const {can, cannot, build} = new AbilityBuilder(createMongoAbility);

    if (role === 'admin') {
        can('access', 'admin');
        can('view', 'all');
        can('use', 'all');
        cannot('use','Create Category');
        cannot('use','Create Product');
        cannot('use','Edit');
        cannot('use','Remove');
    } else if (role === 'kassa') {
        can('access', 'kassa');
        cannot('view', 'qoldiqlar');
        cannot('view', 'RoliComponent');
        cannot('view', 'Actions');
        cannot('delete', 'anything');
    }

    return build();
}