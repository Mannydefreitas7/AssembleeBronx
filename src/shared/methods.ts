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
    .filter(part => part.parent === Parent.bibleReadingSecondary)
    return _parts.length > 0 ? _parts[0] : {}
}

export const lifeSecondary = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.lifeSecondary);
}

export const applySecondary = (parts: Part[]) : Part[] => {
    return parts
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
    .filter(part => part.parent === Parent.applySecondary);
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