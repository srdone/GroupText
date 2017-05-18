import { GroupTextPage } from './app.po';

describe('group-text App', () => {
  let page: GroupTextPage;

  beforeEach(() => {
    page = new GroupTextPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
