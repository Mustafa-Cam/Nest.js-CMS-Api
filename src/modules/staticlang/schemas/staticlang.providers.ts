import { Connection } from 'mongoose';
import { StaticLangSchema } from './staticlang.schema';

export const languageModelProviders = [
  {
    provide: 'STATICLANG_MODEL', //! providerimizin adı
    useFactory: (
      connection: Connection, //! fabrika fonksiyonumuz Connection sınıfından bir nesen oluşturur(oop) ve ardından bir model tanımlar.
    ) => connection.model('StaticLang', StaticLangSchema), //! burda da express de model tanımlıyorduk ona benziyor.
    inject: ['DATABASE_CONNECTION'], //! DATABASE_CONNECTION adında bir provider inject edilmiş. Yani bu adda olan bir bileşene bağımlıdır.
  },
];
