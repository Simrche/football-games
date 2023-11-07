import { useContext } from "@nuxtjs/composition-api";
import * as iso3311a2 from "iso-3166-1-alpha-2";
import { letterDict, nationalityDict } from "./dicts";

export function useSupabase() {
    const { $supabase } = useContext();

    return $supabase;
}

export function normalizeString(string: string | undefined) {
    if (!string) return "";

    return string
        .split("")
        .map((letter) => (letterDict[letter] ? letterDict[letter] : letter))
        .join("");
}

export function getLastname(name: string) {
    const splitedName = name.match(
        /(([A-zÀ-ú]+)(-[A-zÀ-ú]+)?)\s+(([A-zÀ-ú]+)(-[A-zÀ-ú]+)?(\s[A-zÀ-ú]+)?(\s[A-zÀ-ú]+)?(\s[A-zÀ-ú]+)?)/
    );

    let lastName;

    if (splitedName) {
        lastName = splitedName[4].trim();
    }

    return lastName;
}

export function getNationalityFlagUrl(nationality: string) {
    return `https://media-4.api-sports.io/flags/${
        iso3311a2.getCode(nationality) ?? nationalityDict[nationality]
    }.svg`;
}
