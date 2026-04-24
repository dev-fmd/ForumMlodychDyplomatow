import { StructureToolOptions } from "sanity/structure";
import { SingleLanguageSingleton as Singleton, TranslationMetadata as Translations } from "./intl";
import { SingleLanguageList as Collection } from "./intl";
import {
  CalendarIcon,
  CogIcon,
  ComposeIcon,
  EarthGlobeIcon,
  HomeIcon,
  TranslateIcon,
  UsersIcon,
} from "@sanity/icons";

/**
 * Structure of the Sanity Studio
 * @see https://www.sanity.io/docs/studio/structure-tool
 */
export const structure: StructureToolOptions = {
  structure: (S) =>
    S.list()
      .id("content")
      .title("Content")
      .items([
        S.divider().title("Strony"),
        Singleton(S, { type: "home", title: "Strona główna", icon: HomeIcon }),
        S.divider().title("Kolekcje"),
        Collection(S, { type: "post", title: "Wpisy", icon: ComposeIcon }),
        Collection(S, { type: "author", title: "Autorzy", icon: UsersIcon }),
        Collection(S, { type: "event", title: "Wydarzenia", icon: CalendarIcon }),
        Collection(S, { type: "region", title: "Przedstawicielstwa", icon: EarthGlobeIcon }),
        S.divider().title("Ustawienia"),
        Singleton(S, { type: "settings", title: "Ustawienia", icon: CogIcon }),
        S.divider().title("Tłumaczenia"),
        Translations(S, { title: "Metadane", icon: TranslateIcon }),
      ]),
};
