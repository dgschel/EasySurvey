import { ComponentRef, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { SurveyModelStorage, SurveyRefData } from "../../util/type/survey-type";
import { CreateSurveyGroupComponent } from "../../shared/feature/create-survey-group/create-survey-group.component";

@Injectable({
  providedIn: 'root'
})
export class SurveyDataStorageService {
  private dataStorageSubject = new BehaviorSubject<SurveyRefData[]>([]);
  surveyData$ = this.dataStorageSubject.asObservable();

  addData(surveyData: SurveyRefData) {
    const currentSurveyData = this.dataStorageSubject.value;
    this.dataStorageSubject.next([...currentSurveyData, surveyData])
  }

  updateData(ref: ComponentRef<CreateSurveyGroupComponent>, surveyState: SurveyRefData) {
    const updatedData = this.dataStorageSubject.value.map(refData => {
      return refData.ref === ref ? { ...refData, data: { ...surveyState.data } } : refData;
    });
    this.dataStorageSubject.next(updatedData);
  }

  removeData(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    const filteredEntries = this.dataStorageSubject.value.filter(entry => entry.ref !== cmpRef);
    this.dataStorageSubject.next(filteredEntries);
  };

  clearData() {
    this.dataStorageSubject.next([]);
  }

  getData$(): Observable<SurveyModelStorage[]> {
    return this.surveyData$.pipe(map(data => data.map(d => d.data)))
  }
}
