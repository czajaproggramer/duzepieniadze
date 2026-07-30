import { serviceById } from '../data/services'
import { addDays, nowStamp, todayISO } from './date'
import { DB_VERSION, uid } from './storage'
import type { Appointment, DB, Message, Pet, User } from './types'

/**
 * Dane startowe demo. Wszystkie daty liczone są względem „dziś",
 * żeby kalendarz i follow-upy zawsze wyglądały świeżo.
 */
export function seedDB(): DB {
  const today = todayISO()
  const stamp = nowStamp()

  const users: User[] = [
    {
      id: 'u_admin',
      name: 'Oksana Kalinchuk',
      email: 'admin@kaelpetgrooming.pl',
      phone: '+48 500 100 200',
      password: 'admin1234',
      role: 'admin',
      createdAt: stamp,
    },
    {
      id: 'u_jan',
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      phone: '+48 601 234 567',
      password: 'demo1234',
      role: 'client',
      createdAt: stamp,
    },
    {
      id: 'u_anna',
      name: 'Anna Nowak',
      email: 'anna@example.com',
      phone: '+48 602 345 678',
      password: 'demo1234',
      role: 'client',
      createdAt: stamp,
    },
    {
      id: 'u_beata',
      name: 'Beata Wójcik',
      email: 'beata@example.com',
      phone: '+48 603 456 789',
      password: 'demo1234',
      role: 'client',
      createdAt: stamp,
    },
    {
      id: 'u_marta',
      name: 'Marta Zielińska',
      email: 'marta@example.com',
      phone: '+48 604 567 890',
      password: 'demo1234',
      role: 'client',
      createdAt: stamp,
    },
  ]

  const pets: Pet[] = [
    {
      id: 'p_fibi',
      ownerId: 'u_jan',
      name: 'Fibi',
      breedId: 'shih-tzu',
      weightKg: 4.8,
      birthYear: 2021,
      notes: 'Nie lubi suszarki przy uszach — prosimy o spokojne tempo.',
      lastGroomingDate: addDays(today, -47), // 6 tyg. minęło → follow-up po terminie
    },
    {
      id: 'p_bruno',
      ownerId: 'u_jan',
      name: 'Bruno',
      breedId: 'cocker',
      weightKg: 9.2,
      birthYear: 2019,
      notes: 'Skłonność do zapalenia uszu, proszę o dokładne osuszenie.',
      lastGroomingDate: addDays(today, -30),
    },
    {
      id: 'p_luna',
      ownerId: 'u_anna',
      name: 'Luna',
      breedId: 'maltipoo',
      weightKg: 4.2,
      birthYear: 2022,
      notes: 'Uwielbia smaczki, bardzo grzeczna na stole.',
      lastGroomingDate: addDays(today, -38), // 5 tyg. minęło → follow-up
    },
    {
      id: 'p_kiki',
      ownerId: 'u_beata',
      name: 'Kiki',
      breedId: 'maltanczyk',
      weightKg: 5.4,
      birthYear: 2020,
      lastGroomingDate: addDays(today, -39), // ~6 tyg. → zbliża się
    },
    {
      id: 'p_nemo',
      ownerId: 'u_marta',
      name: 'Nemo',
      breedId: 'pomeranian',
      weightKg: 4.5,
      birthYear: 2023,
      notes: 'Szczeniak, pierwsza wizyta była w maju.',
      lastGroomingDate: addDays(today, -21),
    },
    {
      id: 'p_tosia',
      ownerId: 'u_marta',
      name: 'Tosia',
      breedId: 'yorkshire',
      weightKg: 3.1,
      birthYear: 2018,
      lastGroomingDate: addDays(today, -44), // 6 tyg. minęło → follow-up
    },
  ]

  const mk = (
    id: string,
    clientId: string,
    petId: string,
    serviceId: string,
    date: string,
    time: string,
    status: Appointment['status'],
  ): Appointment => {
    const s = serviceById(serviceId)!
    return {
      id,
      clientId,
      petId,
      serviceId,
      date,
      time,
      durationMin: s.durationMin,
      price: s.price,
      status,
      createdAt: stamp,
      paid: status !== 'cancelled',
      paymentMethod: status !== 'cancelled' ? 'Karta' : undefined,
    }
  }

  const appointments: Appointment[] = [
    // historia
    mk('a1', 'u_jan', 'p_fibi', 'shih-tzu-do-5', addDays(today, -47), '11:00', 'completed'),
    mk('a2', 'u_jan', 'p_bruno', 'cocker-pow-7', addDays(today, -30), '14:00', 'completed'),
    mk('a3', 'u_anna', 'p_luna', 'maltipoo-do-5', addDays(today, -38), '10:00', 'completed'),
    mk('a4', 'u_beata', 'p_kiki', 'maltanczyk-pow-5', addDays(today, -39), '13:30', 'completed'),
    mk('a5', 'u_marta', 'p_tosia', 'yorkshire-do-4', addDays(today, -44), '16:00', 'completed'),
    mk('a6', 'u_marta', 'p_nemo', 'pomeranian-pow-4', addDays(today, -21), '10:30', 'completed'),
    // zajęte terminy w przyszłości — kalendarz nie jest pusty.
    // Uwaga: pies z umówioną wizytą nie dostaje follow-upu, dlatego Fibi, Kiki
    // i Tosia celowo nie mają rezerwacji — na nich widać działanie automatu.
    mk('a7', 'u_marta', 'p_nemo', 'pomeranian-pow-4', addDays(today, 2), '10:00', 'scheduled'),
    mk('a8', 'u_anna', 'p_luna', 'maltipoo-do-5', addDays(today, 5), '10:00', 'scheduled'),
    mk('a9', 'u_jan', 'p_bruno', 'cocker-pow-7', addDays(today, 6), '14:30', 'scheduled'),
    mk('a10', 'u_beata', 'p_kiki', 'maltanczyk-pow-5', addDays(today, 12), '13:00', 'scheduled'),
  ]

  const messages: Message[] = [
    {
      id: uid('msg'),
      fromName: 'Katarzyna Lis',
      fromEmail: 'k.lis@example.com',
      phone: '+48 605 111 222',
      topic: 'Pytanie o termin',
      body: 'Dzień dobry, mam maltipoo 6 kg. Czy da się umówić wizytę w sobotę rano w przyszłym miesiącu? Pozdrawiam!',
      createdAt: new Date(Date.now() - 36e5 * 5).toISOString(),
      read: false,
      source: 'formularz',
    },
    {
      id: uid('msg'),
      fromName: 'Paweł Adamczyk',
      fromEmail: 'pawel.adamczyk@example.com',
      phone: '+48 606 333 444',
      topic: 'Pierwsza wizyta szczeniaka',
      body: 'Cześć! Mamy 4-miesięcznego shih tzu, to jego pierwszy raz u groomera. Ile trwa taka wizyta i czy można zostać na miejscu?',
      createdAt: new Date(Date.now() - 36e5 * 29).toISOString(),
      read: false,
      source: 'formularz',
    },
    {
      id: uid('msg'),
      fromName: 'Anna Nowak',
      fromEmail: 'anna@example.com',
      phone: '+48 602 345 678',
      topic: 'Zmiana godziny',
      body: 'Dzień dobry, czy mogłabym przesunąć wizytę Luny o godzinę później? Utknęłam w pracy.',
      createdAt: new Date(Date.now() - 36e5 * 52).toISOString(),
      read: true,
      source: 'panel klienta',
    },
  ]

  return {
    version: DB_VERSION,
    users,
    pets,
    appointments,
    messages,
    followUps: [],
    notifications: [],
    settings: { autoSendFollowUps: true, leadDays: 7 },
    followUpLog: [],
  }
}
