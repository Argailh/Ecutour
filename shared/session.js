// shared/session.js - MIGRADO A INDEXEDDB

const DB_CONFIG = {
    name: 'EcuTourDB',
    version: 1,
    storeName: 'users'
};

// --- CAPA DE BASE DE DATOS (IndexedDB) ---
const DB = {
    db: null,

    init() {
        return new Promise((resolve, reject) => {
            if (this.db) return resolve(this.db);

            const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(DB_CONFIG.storeName)) {
                    // Email será la llave primaria
                    db.createObjectStore(DB_CONFIG.storeName, { keyPath: 'email' });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                console.log('IndexedDB: Conexión exitosa');
                resolve(this.db);
            };

            request.onerror = (e) => {
                console.error('IndexedDB: Error', e.target.error);
                reject(e.target.error);
            };
        });
    },

    async addUser(user) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([DB_CONFIG.storeName], 'readwrite');
            const store = tx.objectStore(DB_CONFIG.storeName);

            // Verificar si existe primero (opcional, pero buena práctica)
            const check = store.get(user.email);

            check.onsuccess = () => {
                if (check.result) {
                    reject(new Error('El usuario ya existe'));
                } else {
                    const addRequest = store.add(user);
                    addRequest.onsuccess = () => resolve(user);
                    addRequest.onerror = () => reject(addRequest.error);
                }
            };
            check.onerror = () => reject(check.error);
        });
    },

    async getUser(email) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([DB_CONFIG.storeName], 'readonly');
            const store = tx.objectStore(DB_CONFIG.storeName);
            const request = store.get(email);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async updateUserPoints(email, newPoints) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([DB_CONFIG.storeName], 'readwrite');
            const store = tx.objectStore(DB_CONFIG.storeName);

            const getRequest = store.get(email);

            getRequest.onsuccess = () => {
                const user = getRequest.result;
                if (!user) return reject(new Error('Usuario no encontrado'));

                user.puntos = newPoints;
                const updateRequest = store.put(user);

                updateRequest.onsuccess = () => resolve(user);
                updateRequest.onerror = () => reject(updateRequest.error);
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }
};

// --- MANEJO DE SESIÓN (LocalStorage para sesión activa) ---
const Session = {
    getUser() {
        const user = localStorage.getItem('ecutour_user');
        return user ? JSON.parse(user) : null;
    },

    saveUser(user) {
        localStorage.setItem('ecutour_user', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('ecutour_user');
        window.location.href = '../index.html';
    },

    requireAuth() {
        if (!this.getUser()) {
            window.location.href = '../index.html';
        }
    },

    async updatePoints(pointsToAdd, reason) {
        const user = this.getUser();
        if (!user) return;

        console.log(`Procesando: +${pointsToAdd} puntos. Motivo: ${reason}`);

        // 1. Calcular nuevo total
        const currentPoints = parseInt(user.puntos) || 0;
        const newTotal = currentPoints + pointsToAdd;

        // 2. Actualizar Session Activa (LocalStorage)
        user.puntos = newTotal;
        this.saveUser(user);

        // 3. Actualizar Base de Datos Persistente (IndexedDB)
        try {
            await DB.updateUserPoints(user.email, newTotal);
            console.log('Puntos actualizados en IndexedDB');
        } catch (e) {
            console.error('Error guardando en BD:', e);
            // No bloqueamos, la sesión activa ya tiene los puntos
        }
    }
};

// --- AUTENTICACIÓN (Fachada para IndexedDB) ---
const Auth = {
    async register(nombre, email, password) {
        const newUser = {
            nombre,
            email,
            password, // En producción deberíamos hashear esto
            puntos: 50, // Bono bienvenida
            fechaRegistro: new Date()
        };

        try {
            await DB.addUser(newUser);
            // Login automático tras registro
            Session.saveUser(newUser);
            return { success: true, user: newUser };
        } catch (error) {
            console.error("Error registro:", error);
            throw error; // El UI manejará el error (ej: "Usuario ya existe")
        }
    },

    async login(email, password) {
        try {
            const user = await DB.getUser(email);

            if (user && user.password === password) {
                Session.saveUser(user);
                return { success: true, user };
            } else {
                return { success: false, message: 'Credenciales incorrectas' };
            }
        } catch (error) {
            console.error("Error login:", error);
            throw error;
        }
    }
};

// Inicializar DB al cargar (opcional, para asegurar que esté lista)
DB.init().catch(console.error);

// PWA Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // En GitHub Pages o rutas profundas, asegúrate que la ruta sea correcta
        // Usamos una ruta absoluta relativa al dominio
        const swPath = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/sw.js'
            : '/Ecutour/sw.js'; // Ajuste posible para GitHub Pages si el repo no es raiz

        // Para este caso local/root, probamos /sw.js primero
        navigator.serviceWorker.register('../sw.js') // Intentamos salir a raiz si estamos en subdir
            .catch(() => navigator.serviceWorker.register('./sw.js')); // Fallack para root
    });
}