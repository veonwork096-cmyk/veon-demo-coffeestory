// All facts come from veon/client.json (ids in comments). Nothing here is invented.
import sumatra from "../assets/packs/sumatra.png";
import tanzania from "../assets/packs/tanzania.png";
import kenya from "../assets/packs/kenya.png";
import nicaragua from "../assets/packs/nicaragua.png";
import brazil from "../assets/packs/brazil.png";
import ethiopia from "../assets/packs/ethiopia.png";
import rwanda from "../assets/packs/rwanda.png";
import colombia from "../assets/packs/colombia.png";
import type { ImageMetadata } from "astro";

export const contacts = {
  phone: "+38 (068) 48-27-286", // company.contacts.phones[0]
  phoneHref: "tel:+380684827286",
  email: "infocoffeestory@gmail.com", // company.contacts.emails[0]
  address: "просп. Олександра Поля, 115", // C-020
  city: "Дніпро",
  hours: "Пн–Сб, 9:00–19:00", // C-011 (контакти, підвал)
  map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Дніпро, просп. Олександра Поля, 115"),
  facebook: "https://www.facebook.com/coffeestory.Ukraine/", // socials[0]
  instagram: "https://www.instagram.com/coffeestoryukraine/", // socials[1]
};

export const soon = "Розділ у розробці";

export interface Coffee {
  name: string;
  price: number; // грн, C-024…C-031
  notes?: string; // C-024, C-028, C-030, C-034
  img: ImageMetadata;
}

export interface Hero {
  id: string;
  name: string;
  line: string; // напис на пачці, C-033
  tone: "ink" | "field";
  img: ImageMetadata;
  alt: string;
  coffees: Coffee[];
}

// Лінійки — за написом на пачці (C-033; для Танзанії, Нікарагуа, Бразилії, Колумбії — за зображенням пачки, concept.md «Проблеми» п. 2).
export const heroes: Hero[] = [
  {
    id: "lys",
    name: "Лис",
    line: "еспресо",
    tone: "ink",
    img: sumatra,
    alt: "Пачка Coffee-Story «Суматра Гайо», лінійка під еспресо, персонаж Лис",
    coffees: [
      { name: "Суматра Гайо", price: 790, notes: "Карамель, лимон, шоколад, сухофрукти, смажений фундук; післясмак мандаринового джему", img: sumatra },
      { name: "Танзанія Аруша", price: 600, notes: "Яскрава кислотність, середня повнота тіла", img: tanzania },
    ],
  },
  {
    id: "shef",
    name: "Шеф",
    line: "від шефа",
    tone: "field",
    img: ethiopia,
    alt: "Пачка Coffee-Story «Ефіопія Мерседес», лінійка від шефа, персонаж Шеф",
    coffees: [
      { name: "Ефіопія Мерседес", price: 1200, notes: "Бергамот, легка кава зі смаком персика; оброблення митий", img: ethiopia },
      { name: "Руанда Русізі", price: 900, notes: "Апельсин, ожина; оброблення натуральний", img: rwanda },
      { name: "Колумбія COFINET", price: 500, img: colombia },
    ],
  },
  {
    id: "vedmid",
    name: "Ведмідь",
    line: "під фільтр",
    tone: "field",
    img: kenya,
    alt: "Пачка Coffee-Story «Кенія АА», лінійка під фільтр, персонаж Ведмідь",
    coffees: [
      { name: "Кенія АА", price: 700, notes: "Фруктовий, винний; оброблення натуральний", img: kenya },
      { name: "Марагоджип Нікарагуа", price: 650, notes: "Винна кислинка, ноти шоколаду, горіхів, дуба, манго, польових квітів", img: nicaragua },
      { name: "Бразилія Габріель Нунес", price: 500, img: brazil },
    ],
  },
];

// Меню сайту клієнта (C-016, ux/demo-home.md п. 5), F-IG-006
export const categories = ["Моносорти", "Купажі", "Елітні сорти", "Кава з бочки", "Без кофеїну", "Дегустаційні набори", "Кава 1 кг"];

// C-032
export const grinds = ["без помелу", "турка", "чашка", "ріжкова кавомашина", "крапельна кавоварка", "гейзер", "френч-прес", "кемекс", "V-60"];

// C-012
export const delivery = [
  { title: "Нова пошта", text: "Відділення або поштомат. Замовили до 17:00 — відправимо наступного робочого дня (Пн–Пт)." },
  { title: "Кур'єр по Дніпру", text: "Замовили до 11:00 — привеземо того ж дня." },
  { title: "Самовивіз з цеху обсмаження", text: "Дніпро, просп. Олександра Поля, 115 — за попереднім замовленням." },
];
export const payments = ["WayForPay на сайті", "На картку monobank", "На картку ПриватБанку", "Apple Pay", "Google Pay", "Готівкою на виробництві або кур'єру"];

// C-014
export const history = [
  { year: "2009", text: "Робота в Італії на виробництві Torrefazione IONIA — сім років, аж до рівня обсмажувачів." },
  { year: "2016", text: "Відтоді — прямі поставки зерна від фермерів." },
  { year: "2017", text: "Відтоді — регулярні поїздки до Ефіопії, Колумбії, Бразилії." },
];

// C-015
export const cities = ["Київ", "Харків", "Дніпро", "Одеса", "Львів", "Запоріжжя"];
