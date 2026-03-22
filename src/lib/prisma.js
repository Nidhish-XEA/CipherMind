"use strict";

const { PrismaClient } = require('@prisma/client');

/** @type {import('@prisma/client').PrismaClient} */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

module.exports = { prisma };
