# JWT 인증 구현 체크리스트

## 완료 정의(DoD)

- [x] POST /login 성공 시 accessToken(짧음) + refreshToken(김) 발급
- [x] GET /login/me 등 보호 API에서 access token 검증(가드)
- [x] access 만료 시 POST /login/refresh로 access 재발급
- [x] 로그아웃 시 refresh 무효화(서버 저장소 기준, revokedAt)
- [ ] 최소 테스트: 성공/실패/만료/토큰재사용(회전) 케이스 통과

## 엣지/실패 모드

- 비번 틀림 / 유저 없음 → 로그인 실패
- access 만료 → 401 → 클라이언트가 refresh로 재발급
- refresh 만료 / revoked → 401
- refresh 탈취(재사용) 탐지 → rotation으로 한 번 쓰면 기존 토큰 revoke, 재사용 시 401
- 토큰이 헤더에 없거나 형식 이상 → 가드에서 401
- 동시 다기기: 현재는 기기별 refresh 행 추가, 로그아웃은 해당 refresh만 revoke

## refresh token rotation 설계 요약

- **왜**: 한 번 사용한 refresh로 다시 요청하면 탈취 가능성으로 간주하고 차단.
- **어떻게**: refresh 호출 시 DB에서 해당 tokenHash 조회 → 유효하면 기존 행 revokedAt 설정, 새 refresh 발급 후 새 행 저장. 이후 같은 refresh로 다시 호출하면 DB에서 revoked 또는 없음 → 401.

## NestJS Guard + Strategy 기본 골격

- **Strategy** (`strategies/jwt.strategy.ts`): `PassportStrategy(Strategy, 'jwt')`, `ExtractJwt.fromAuthHeaderAsBearerToken()`, `validate(payload)`에서 `req.user`에 넣을 값 반환.
- **Guard** (`guards/jwt-auth.guard.ts`): `@Injectable()` + `extends AuthGuard('jwt')`.
- **컨트롤러**: `@UseGuards(JwtAuthGuard)` 적용한 라우트는 Bearer 없으면 401.

## 검증 테스트 케이스(수동)

1. 로그인 성공 → access_token, refresh_token, user 반환, DB에 refresh_tokens 행 생성
2. 로그인 실패(비번 틀림) → success: false 또는 401
3. 보호 API: 토큰 없음 → 401
4. 보호 API: 만료 토큰 → 401
5. refresh 성공 → 새 access_token, refresh_token 반환, 이전 refresh로 재호출 시 401
6. refresh 토큰 재사용(이미 한 번 사용한 토큰) → 401
7. logout 후 해당 refresh로 refresh 호출 → 401
