// _app.js의 상위 파일이 된다. 즉 최상위 파일이 _document.js 이다.
// 아직 document는 훅말고 클래스 타입으로 만들어야 한다고 한다.
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  // 곧 안쓰일 getInitialProps메서드일 수 있다.
  // _app.js나 _document.js에서만 쓰이는 특수한 서버사이드랜더링 메서드라고 생각하자.
  // 보통 getServerSideProps()나 getStaticProps()를 쓴다.
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (error) {
      console.error(error);
    } finally {
      sheet.seal();
    }
  }

  // babel로만으로 ie에서 아래 코드가 돌아가지 않는다. 바벨폴리필을 쓰면 되는데 이건 너무 무거워서 그냥 폴리필을 넣어주면 된다.
  // NextScript 보다 위에 폴리필 넣어주자.
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
