import request from "supertest";
import { server } from "src/server";
import { prisma } from "src/lib/prisma";
import { randomUUID } from "crypto";

describe("Dashboard Endpoints Integration", () => {
    const userId = "ckxq9kz3v0000z8m1f3q9p8a1"; // O mesmo usado nos controllers pro teste

    beforeAll(async () => {
        // Limpa e cria um user base
        await prisma.task.deleteMany();
        await prisma.routine.deleteMany();
        await prisma.user.deleteMany();

        await prisma.user.create({
            data: {
                id: userId,
                name: "Test User",
                email: "test@example.com",
                password: "password",
                xp: 150,
                level: 2,
                stars: 5,
                tulips: 3
            }
        });
    });

    describe("GET /api/user/me", () => {
        it("should return user profile with xpToNextLevel", async () => {
            const response = await request(server).get("/api/user/me");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                name: "Test User",
                level: 2,
                xp: 150,
                xpToNextLevel: 50,
                stars: 5,
                tulips: 3
            });
        });
    });

    describe("GET /api/routine/calendar", () => {
        it("should return monthly routines status", async () => {
            const date = new Date(2026, 1, 10); // Feb 10
            await prisma.routine.create({
                data: {
                    userId,
                    date,
                    status: "DONE"
                }
            });

            const response = await request(server).get("/api/routine/calendar?month=2&year=2026");

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.some((r: any) => r.status === "DONE")).toBe(true);
        });
    });

    describe("GET /api/stats/highlights", () => {
        it("should return monthly highlights", async () => {
            const response = await request(server).get("/api/stats/highlights?month=2&year=2026");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("perfectDays");
            expect(response.body).toHaveProperty("incompleteDays");
            expect(response.body.totalStars).toBe(5);
            expect(response.body.weeklyTulips).toBe(3);
        });
    });

    describe("GET /api/routine/today", () => {
        it("should return today's routine tasks and stats", async () => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);

            // Cria rotina e task pra hoje se não existir
            const routine = await prisma.routine.upsert({
                where: { userId_date: { userId, date } },
                update: {},
                create: { userId, date, status: "INPROGRESS" }
            });

            await prisma.task.create({
                data: {
                    userId,
                    routineId: routine.id,
                    content: "Test Task",
                    category: "WORK",
                    durationSec: 3600,
                    plannedStart: new Date(),
                    plannedEnd: new Date(),
                    status: "PENDING"
                }
            });

            const response = await request(server).get(`/api/routine/today?date=${date.toISOString()}`);

            expect(response.status).toBe(200);
            expect(response.body.routine).toBeDefined();
            expect(response.body.tasks).toBeInstanceOf(Array);
            expect(response.body.tasks.length).toBeGreaterThan(0);
            expect(response.body.stats).toBeDefined();
            expect(response.body.stats.totalTasks).toBeGreaterThan(0);
        });
    });
});
