import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,  HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const HTTP_OPTIONS = { withCredentials: true };

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private urlBase = environment.apiUrl;
  private postUrl = `${this.urlBase}/posts`;

  constructor( private http: HttpClient) {}


  createPost(postData: FormData): Observable<any> {

    return this.http.post(this.postUrl, postData, HTTP_OPTIONS);
  }

  getPosts(query: any): Observable<any> {
    let params = new HttpParams(); 

    for (const key in query) {
      if (query[key] !== undefined && query[key] !==null) {
        params = params.set(key, query[key].toString())
      }
    }

    return this.http.get(this.postUrl, {params, withCredentials: true})
  }

  getPost(id:string): Observable<any> {

    return this.http.get(`${this.postUrl}/${id}`, HTTP_OPTIONS);
  }

  addAndDeleteLike(postId: string, method: 'POST' | 'DELETE'): Observable<any> {
    
    if (method === 'POST') {
      return this.http.post(`${this.postUrl}/${postId}/like`, null, HTTP_OPTIONS)
    } else {
      return this.http.delete(`${this.postUrl}/${postId}/like`, HTTP_OPTIONS)
    }

  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.postUrl}/${postId}`, HTTP_OPTIONS);
  }

  getComments(query: any, postId: string): Observable<any> {
    let params = new HttpParams(); 

    for (const key in query) {
      if (query[key] !== undefined && query[key] !== null) {
        params = params.set(key, query[key].toString());
      }
    }

    return this.http.get(`${this.postUrl}/${postId}/comentarios`,{ params, ...HTTP_OPTIONS });
  }

  createComment(postId: string, body: { mensaje: string }): Observable<any> {
    return this.http.post(
      `${this.postUrl}/${postId}/comentarios`, body, HTTP_OPTIONS);
  }

  updateComment( postId: string, comentarioId: string, body: { mensaje: string }): Observable<any> {
    return this.http.put(`${this.postUrl}/${postId}/comentarios/${comentarioId}`, body, HTTP_OPTIONS);
    
  }

}
