import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from '../_models/index';

@Injectable()
export class SubjectService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Subject[]>('/api/subjects');
    }

    getById(id: number) {
        return this.http.get('/api/subjects/' + id);
    }

    create(subject: Subject) {
        return this.http.post('/api/subjects', subject);
    }

    update(subject: Subject) {
        return this.http.put('/api/subjects/' + subject.id, subject);
    }

    delete(id: number) {
        return this.http.delete('/api/subjects/' + id);
    }
}