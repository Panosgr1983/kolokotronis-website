import { useCoreEntityData } from "./core-hooks";

export interface BusinessAddress {
  name: string;
  street: string;
  number: string;
  area: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  floor: string;
  instructions: string;
}

export interface BusinessContact {
  phone: string;
  mobile: string;
  email: string;
  website: string;
}

export interface BusinessMaps {
  url: string;
  embed_url: string;
  latitude: string;
  longitude: string;
  place_id: string;
}

export interface BusinessSocial {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  threads: string;
}

export interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface BusinessInformation {
  address: BusinessAddress;
  contact: BusinessContact;
  maps: BusinessMaps;
  social: BusinessSocial;
  hours: BusinessHours;
}

const defaultBusinessInfo: BusinessInformation = {
  address: {
    name: "Νικόλας Κολοκοτρώνης",
    street: "Απόλλωνος",
    number: "30",
    area: "Νέο Ηράκλειο",
    city: "Αθήνα",
    region: "Αττική",
    postal_code: "14121",
    country: "Ελλάδα",
    floor: "ισόγειο",
    instructions: "",
  },
  contact: {
    phone: "+30 697 437 1139",
    mobile: "",
    email: "nikolashealing@yahoo.gr",
    website: "",
  },
  maps: {
    url: "https://www.google.com/maps/dir/?api=1&destination=%CE%91%CF%80%CF%8C%CE%BB%CE%BB%CF%89%CE%BD%CE%BF%CF%82+30+%CE%9D%CE%AD%CE%BF+%CE%97%CF%81%CE%AC%CE%BA%CE%BB%CE%B5%CE%B9%CE%BF+%CE%91%CE%B8%CE%AE%CE%BD%CE%B1+14121",
    embed_url: "https://www.google.com/maps?q=%CE%91%CF%80%CF%8C%CE%BB%CE%BB%CF%89%CE%BD%CE%BF%CF%82+30+%CE%9D%CE%AD%CE%BF+%CE%97%CF%81%CE%AC%CE%BA%CE%BB%CE%B5%CE%B9%CE%BF+%CE%91%CE%B8%CE%AE%CE%BD%CE%B1+14121&output=embed",
    latitude: "",
    longitude: "",
    place_id: "",
  },
  social: {
    facebook: "https://www.facebook.com/nikolas.kolokotronis/",
    instagram: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    twitter: "",
    threads: "",
  },
  hours: {
    monday: "10:00 – 20:00",
    tuesday: "10:00 – 20:00",
    wednesday: "10:00 – 20:00",
    thursday: "10:00 – 20:00",
    friday: "10:00 – 20:00",
    saturday: "κατόπιν ραντεβού",
    sunday: "κλειστά",
  },
};

export function useBusinessInfo(): BusinessInformation {
  return useCoreEntityData('business_information', defaultBusinessInfo);
}
