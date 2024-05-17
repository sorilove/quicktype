import * as languages from "./languages";
import { quicktypeForLanguage } from "./utils";


(async () => {

    languages.TypeScriptLanguage.output = "test/initial_equipment.ts";
    languages.TypeScriptLanguage.topLevel = "InitialEquipment";
    await quicktypeForLanguage(languages.TypeScriptLanguage, "test/Initial_equipment.json", "json", true, { 'runtime-typecheck': 'false' });

})();