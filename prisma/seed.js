const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')
const prisma = new PrismaClient()


let hashedPassword;
let salt;
let buyers = [];
let businesses = [];
let services = [];
let admin;

function hashPassword(password, salt) {

    if (!password) {
        return Promise.reject(new Error('Password is required'));
    }

    if (!salt) {
        return Promise.reject(new Error('Salt is required'));
    }

    return new Promise((resolve, reject) => {
        try {
            crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
                if (error) {
                    reject(error);
                    return;
                }

                try {
                    const hashedPassword = hash.toString('hex').normalize();
                    resolve(hashedPassword);
                } catch (stringifyError) {
                    reject(stringifyError);
                }
            });
        } catch (cryptoError) {
            reject(cryptoError);
        }
    });
}

async function createBuyers(amount) {
    for (let i = 0; i < amount; i++) {
        const email = "buyer" + i + "@techsandthecity.works";
        const name = "Buyer" + i;

        buyers.push(await prisma.buyer.upsert({
                where: {email},
                update: {},
                create: {
                    email: email,
                    name: name,
                    password: hashedPassword,
                    salt: salt,
                    profile_img: generateImage("buyerProfileImg", i),
                }
            })
        );
    }
}

async function createBusinesses(amount) {
    for (let i = 0; i < amount; i++) {
        const email = "business" + i + "@techsandthecity.works";
        const name = "Business" + i;

        businesses.push(await prisma.business.upsert({
                where: {email},
                update: {},
                create: {
                    email: email,
                    name: name,
                    password: hashedPassword,
                    salt: salt,
                    logo: generateImage("businessLogo", i),
                }
            })
        );
    }
}

async function createAdmin(){
    const email = "admin@techsandthecity.works";
    const name = "Admin";
    const password = await hashPassword("admin", "admin_salt");

    admin = await prisma.admin.upsert({
        where: {email},
        update: {},
        create: {
            email: email,
            name: name,
            password: password,
            salt: "admin_salt",
            profile_img: generateImage("buyerProfileImg", 999),
        }
    });
}

async function createServicesForBusinesses(amount) {
    let j = 0;
    for (const business of businesses) {
        for (let i = 0; i < amount; i++) {
            j++;
            const name = "Service of " + business.name + " " + i;
            const description = "Description of service " + business.name + " " + i;
            const price = Math.random() * 100;

            const existingService = await prisma.service.findFirst({
                where: {
                    name: name,
                    businessId: business.id
                }
            });

            if (existingService) {
                services.push(existingService);
            } else {
                const newService = await prisma.service.create({
                    data: {
                        name: name,
                        description: description,
                        price: price,
                        image: generateImage("serviceImage", j),
                        businessId: business.id
                    }
                });
                services.push(newService);
            }
        }
    }
}

function generateImage(type, i){
    switch (type) {
        case "buyerProfileImg":
            return "https://dummyimage.com/400x400/00ff00/fff&text=Buyer" + i;
        case "businessLogo":
            return "https://dummyimage.com/400x400/ff0000/fff&text=Biz" + i;
        case "serviceImage":
            return "https://dummyimage.com/400x400/0000ff/fff&text=Service" + i;
    }
}

async function main() {
    const password = "cs4116";

    salt = "password_salt";
    hashedPassword = await hashPassword(password, salt);

    await createBuyers(10);
    await createBusinesses(10);
    await createAdmin();
    await createServicesForBusinesses(5);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })