import { Parent, Part } from "../models/wol";

export const prayers = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.prayer);
}

export const chairmans = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.chairman);
}

export const treasures = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.treasures);
}

export const life = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.life);
}

export const apply = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.apply);
}


export const bibleReadingSecondary = (parts: Part[]) : Part => {
    let _parts = parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.secondary)
    return _parts.length > 0 ? _parts[0] : {}
}

export const applySecondary = (parts: Part[]) : Part[] => {
    let _parts = parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.secondary)
    console.log(_parts.slice(0, _parts.length - 1))
    return _parts.slice(1, _parts.length);
}



export const talk = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.talk);
}

export const wt = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.wt);
}