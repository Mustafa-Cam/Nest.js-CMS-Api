import { Connection } from 'mongoose';
import { MemberSchema } from './member.schema';

export const memberModelProviders = [
  {
    provide: 'MEMBER_MODEL', //! providerimizin adı
    useFactory: (
      connection: Connection, //! fabrika fonksiyonumuz Connection sınıfından bir nesen oluşturur(oop) ve ardından bir model tanımlar.
    ) => connection.model('Member', MemberSchema), //! burda da express de model tanımlıyorduk ona benziyor.
    inject: ['DATABASE_CONNECTION'], //! DATABASE_CONNECTION adında bir provider inject edilmiş. Yani bu adda olan bir bileşene bağımlıdır.
  },
];
