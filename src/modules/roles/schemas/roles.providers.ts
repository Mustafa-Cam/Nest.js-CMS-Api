import { Connection } from 'mongoose';
import { RolesSchema } from './roles.schema';

export const rolesModelProviders = [
  {
    provide: 'ROLES_MODEL', //! providerimizin adı
    useFactory: (
      connection: Connection, //! factory fonksiyonumuz Connection sınıfından bir nesen oluşturur(oop) ve ardından bir model tanımlar.
    ) => connection.model('Roles', RolesSchema), //! burda da express de model tanımlıyorduk ona benziyor.
    inject: ['DATABASE_CONNECTION'], //! DATABASE_CONNECTION adında bir provider inject edilmiş. Yani bu adda olan bir bileşene bağımlıdır.
  },
];
