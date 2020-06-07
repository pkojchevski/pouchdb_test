// import PouchDB from 'pouchdb';

import PouchDB from 'pouchdb-browser'

// const db = new PouchDB(‘todos’);
const remoteDatabase = new PouchDB(`http://127.0.0.1:5984/todos`);

export default class DB {
    constructor(name) {
        this.db = new PouchDB(name);
        PouchDB.sync(this.db, remoteDatabase, {
            live: true,
        });
    }


    async getAllNotes() {
        let allNotes = await this.db.allDocs({ include_docs: true })
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc)

        return notes
    }

    reactToChanges() {
        return new Promise((resolve, reject) =>
            this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', () => {
                return resolve()
            }).on('error', () => reject()))
    }

    async createNote(note) {
        note.createdAt = new Date();
        note.updatedAt = new Date();

        const res = await this.db.post({ ...note })

        return res

    }

    async updateNote(note) {
        note.updatedAt = new Date();

        const res = await this.db.put({ ...note });
        return res;
    }

    async deleteNote(note) {
        await this.db.remove(note);
    }
}