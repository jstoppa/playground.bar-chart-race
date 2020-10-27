import { TestBed, async } from '@angular/core/testing';
import { AppBarChartRaceComponent } from './app-bar-chart-race.component';


describe('AppBarChartRaceComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppBarChartRaceComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppBarChartRaceComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'appName'`, () => {
    const fixture = TestBed.createComponent(AppBarChartRaceComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('appName');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppBarChartRaceComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('appName app is running!');
  });
});
