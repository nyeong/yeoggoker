# [수빈이의 역곡노트](https://annyeong.me/yeoggoker)

Inspired by [somalife](https://github.com/swmaestro/somat).

- 가톨릭대학교, 역곡 주변의 갈만한 곳 모음입니다.

## 추가할 내용이 있다면

- `./src/data/tags.json`에 있는 태그를 참고하거나 추가하여서 (태그는 카테고리 상관 없이 유일한 값이여야합니다.)
- `./src/data/reviews.json`에 형식에 맞게 정보를 추가해주세요.
- x, y 값은 위도, 경도입니다. 구글맵으로 쉽게 확인할 수 있습니다.
- 아니면 [저](https://annyeong.me)에게 연락주세요.

## 이견이 있다면

않이 여기는 않 이런데 왜 이렇다고 해놨어???

- GitHub 계정이 있다면 이슈로 넣어주세요.
- 아니면 [저](https://annyeong.me)에게 연락주세요.

## 코드를 고치고 싶다면

- `git clone`하여 코드를 수정합니다.
- `npm run dev`로 서버를 띄워 잘 고쳐졌는지 확인합니다.
- `npm run build` 후 풀 리퀘스트를 넣어주세요.

## 구조

```ts
{
    tags: string[]; // 태그 목록 참고하여 작성
    name: string;   // 이름
    desc: string;   // 설명 (추천 메뉴나 꿀팁 등)
    x: number;      // 위도
    y: number;      // 경도
}
```
