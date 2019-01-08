![](./img/readme_img_00.png)

# 개요 (Summary)
the_madness 는 간단 한 html5 게임 입니다.  
(the_madness is a simple html5 game.)  

평소에 HP.Lovecraft 작품을 좋아했고,  
(I usually liked HP.Lovecraft work,)  

보면 안 되는 것을 보아버린... 광기어린 상황을 나타내고 싶었습니다.  
(Saw a terrible situation should not look at... wanted to express insanity.)  


# 시작 방법 (How to get started)
이 게임은 [rust](https://rust-lang.org) 언어가 설치되어 있어야 합니다.  
(This game requires [rust](https://rust-lang.org) language installed.)  

1. 저장소를 복사 합니다.  
2. `설치경로'/server` 경로에서 'cargo run' 커맨드를 실행 합니다.  
3. 컴파일 뒤에 'localhost:8989' 포트로 서버가 실행 되는것을 확인 합니다.  
4. `설치경로/client/index.html` 을 웹브라우저 에서 실행 합니다.  
해당 웹브라우저가 파일에 접근할 수 있는 옵션을 줘야 합니다. 예를 들어, [Chrome](http://www.chrome-allow-file-access-from-file.com/).  

![](./img/readme_img_01.png)  

1. Copy the repository.  
2. Run the 'cargo run' command in the `InstallPath/server` path.  
3. After compile, make sure that the server is running on the 'localhost: 8989' port.  
4. Run `InstallPath/client/index.html` in your web browser.  
You need to give your web browser the option to access the file. For example, [Chrome](http://www.chrome-allow-file-access-from-file.com/).  

키보드 왼쪽, 오른쪽 키로 이동 합니다.  
(Move to the left and right keys of the keyboard.)  

터치 디바이스는 화면 왼쪽, 오른쪽을 터치해서 이동 합니다.  
(Touch devices are moved by touching the left and right sides of the screen.)  

스페이스바나 말 풍선 아이콘을 클릭해서 음성을 녹음하면,  
(If you record a voice by clicking the space bar or the speech balloon icon,)  

접속 한 다른 플레이어에게 음성을 전송 합니다.  
(Sends voice to other connected players.)  

`https` 보안 이슈로, 로컬 실행 만 마이크가 작동 합니다.  
(`https` security issue, only local run microphones work.)  

# 외부 도움 (External help)
![](./img/readme_img_04.png)
+ [Louis Zuno](https://www.patreon.com/ansimuz/overview)  
사용 된 매우 훌륭 한 pixelart 리소스는 모두 그의 작품 입니다.  
저는 그에 후원자 이기도 합니다.  
(All of the very good pixelart resources used are his works.  
I am also a supporter of him.)  


![](./img/readme_img_05.png)
+ [Thorbjørn Lindeijer](https://www.patreon.com/bjorn/overview)  
매우 훌륭 한 `Tiled Editor`를 사용 했습니다.  
저는 그에 후원자 이기도 합니다.  
(I used a very nice `Tiled Editor`.  
I am also a supporter of him.)  


![](./img/readme_img_02.png)
+ [ASEPRITE](https://store.steampowered.com/app/431730/Aseprite/)  
매우 훌륭 한 pixelart 스프라이트 툴 입니다.  
구입 하시는 것을 망설이지 마세요.  
(It is a very nice pixelart sprite tool.  
Do not hesitate to purchase.)  

# 써드파티 (Thirdparty)
+ [Pizzicato.js](https://github.com/alemangui/pizzicato) : Used the voice effects.  
+ [SAT.js](https://github.com/jriecken/sat-js) : Used the collision detection.    
+ [ces.js](https://github.com/qiao/ces.js) : Used the ecs framework.    
+ [controlKit.js](https://github.com/automat/controlkit.js) : Used the gui.  
+ [gl-matrix.js](https://github.com/toji/gl-matrix) : Used the mathmatics.  
+ [howler.js](https://github.com/goldfire/howler.js): Used the sound play.  
+ [recorder.js](https://github.com/mattdiamond/Recorderjs) : Used the voice recording.  

# 기술 (Technology)
## 엔진 (Engine)
자체 제작 엔진 입니다.  
(It it inhouse engine.)  

위에 언급 한 라이브러리를 제외 하고는 모두 직접 개발 했습니다.  
(Except for the library mentioned above, all were developed by self.)  
## 골격 (Framework)
[ECS](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system) 를 기본으로 제작 되었습니다.  
(It is based on [ECS](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system)).  

게임에 모든 구성이 Entity, Component, System 으로 이루어져 있습니다.  
(All configurations in the game consist of Entity, Component, and System.)  
## 랜더링 (Rendering)
![](./img/readme_img_07.png)  
WebGL을 이용해서 직접 개발 했습니다.  
(Developed using WebGL.)  

최대 한 모아서 Batch rendering 합니다.  
(Batch rendering.)  

후 처리 효과도 지원 합니다.  
(Post processing effects are also supported.)  

현재는 광기 상태가 되었을 때, 화면이 지글 거리는 효과가 들어가 있습니다.  
(Now, when the mad state, the screen contains a sizzling effect.)  
## 에디터 (Editor)
### 애니메이션 (Animation)
![](./img/readme_img_06.png)  
`설치경로/client/editor/animation/editor_anim.html` 에서 실행 가능 합니다.  
(Executable in `InstallPath/client/editor/animation/editor_anim.html`).  

`ASEPRITE` 툴에서 뽑은 데이터를 게임에 맞게 가공해서 뽑아 줍니다.  
(`ASEPRITE` data is processed and extracted.)  
### 엔티티 (Entity)
![](./img/readme_img_08.png)  
`설치경로/client/editor/entity/editor_entity.html` 에서 실행 가능 합니다.  
(Executable in `InstallPath/client/editor/entity/editor_entity.html`).  

Entity에 구성 될 Component들을 설정하고, 뽑아 줍니다.  
(Sets and extracts the Components to be configured in the Entity.)  
### 타일드 (Tiled)
![](./img/readme_img_09.png)  
`설치경로/client/editor/tiled/editor_tiled.html` 에서 실행 가능 합니다.  
(Executable in `InstallPath/client/editor/tiled/editor_tiled.html`).  

`Tiled Editor` 에서 뽑은 데이터를 게임에 맞게 가공해서 뽑아 줍니다.  
(`Tiled Editor` data is processed and extracted.)  
## 서버 (Server)
rust 언어로 개발 했습니다.  
(Developed in rust language.)  

간단 한 Echo 서버 입니다.  
(It is a simple Echo server.)  

Websocket 으로 송신 합니다.  
(Send to Websocket.)  
