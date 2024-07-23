import { Connection } from 'mongoose';
import { OptionsSchema } from './options.schema';

export const optionsModelProviders = [
  {
    provide: 'OPTIONS_MODEL', //! providerimizin adı
    useFactory: (
      connection: Connection, //! fabrika fonksiyonumuz Connection sınıfından bir nesen oluşturur(oop) ve ardından bir model tanımlar.
    ) => connection.model('Options', OptionsSchema), //! burda da express de model tanımlıyorduk ona benziyor. 
    inject: ['DATABASE_CONNECTION'], //! DATABASE_CONNECTION adında bir provider inject edilmiş. Yani bu adda olan bir bileşene bağımlıdır.
  },
];
