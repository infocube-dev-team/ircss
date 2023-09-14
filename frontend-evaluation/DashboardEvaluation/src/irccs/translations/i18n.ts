import i18n, {__} from '../../translations/i18n';
import en from '../../irccs/translations/en';
import it from '../../irccs/translations/it';
import {TOptions} from "i18next";

i18n.addResourceBundle('en', 'irccs', en);
i18n.addResourceBundle('it', 'irccs', it);

export const __i = (translation: string, interpolation?: TOptions) => {

    if(interpolation === undefined) {
        interpolation = {}
    }

    return __(translation, Object.assign(interpolation, {ns: 'irccs'}))
}