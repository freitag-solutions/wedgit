import { WedgItPage } from './app.po';

describe('wedg-it App', function() {
  let page: WedgItPage;

  beforeEach(() => {
    page = new WedgItPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
