import { Connection } from 'mongoose';
import { LogSchema } from './log.schema';

export const logModelProviders = [
  {
    provide: 'LOG_MODEL', //! providerimizin adı
    useFactory: (
      connection: Connection, //! fabrika fonksiyonumuz Connection sınıfından bir nesen oluşturur(oop) ve ardından bir model tanımlar.
    ) => connection.model('Log', LogSchema), //! burda da express de model tanımlıyorduk ona benziyor. 
    inject: ['DATABASE_CONNECTION'], //! DATABASE_CONNECTION adında bir provider inject edilmiş. Yani bu adda olan bir bileşene bağımlıdır.
  },
];
