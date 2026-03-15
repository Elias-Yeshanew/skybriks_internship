import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Intern } from "../models/intern.model";
import { Batch } from "../models/batch.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    private baseUrl = 'http://localhost:8084/api';

    constructor(private http: HttpClient) { }

    getBatches(): Observable<Batch[]> {
        return this.http.get<Batch[]>(`${this.baseUrl}/batches`);
    }

    createBatch(batch: Batch): Observable<Batch> {
        return this.http.post<Batch>(`${this.baseUrl}/batches`, batch);
    }

    deleteBatch(id: number): Observable<string> {
        return this.http.delete(`${this.baseUrl}/batches/${id}`, { responseType: 'text' });
    }

    getInterns(): Observable<Intern[]> {
        return this.http.get<Intern[]>(`${this.baseUrl}/interns`);
    }

    registerIntern(intern: Intern): Observable<Intern> {
        return this.http.post<Intern>(`${this.baseUrl}/interns`, intern);
    }

    deleteIntern(id: number): Observable<string> {
        return this.http.delete(`${this.baseUrl}/interns/${id}`, { responseType: 'text' });
    }

    getInternById(id: number): Observable<Intern> {
        return this.http.get<Intern>(`${this.baseUrl}/interns/${id}`);
    }

    updateIntern(id: number, intern: Partial<Intern>): Observable<Intern> {
        return this.http.put<Intern>(`${this.baseUrl}/interns/${id}`, intern);
    }
}