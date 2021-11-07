const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

//스트림을 받아오기. stream = video + audio
let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind ==="videoinput");

                        // <- 어떤카메라가 선택된지 알려주는 함수->
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.lable;
            if(currentCamera.label === camera.label) {
                // 목록의 카메라 옵션이 지금 현재 사용하는 카메라와 같은 label을 사용한다면 우리가 고른게 현재의 카메라라는걸 의미
                option.selected = true;
            }
            camerasSelect.appendChild(option);
            //내가 선택한 카메라명을 옵션에 넣어줌
        });
    }catch(e){ 
        console.log(e);
    }
}

//  비디오를 시작하는 함수
async function getMedia(deviceId){
    // deviceId가 없을때 실행되는 함수
    const initialConstrains = { // 단어에 t가없음 여긴
        audio : true,
        video : { facingMode: "user" }
    };
    // cameraId가 있을때 실행되는 함수
    const cameraConstraints ={
        audio : true,
        video : { deviceId : { exact : deviceId } },

    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstrains//  <--여기서 오타나서 카메라 안됬던거였음.
            // deviceId가 있다면 cameraconstraints를 이용ㅎ아고 deviceID가 없다면 initialConstrains를 이용
        );
        myFace.srcObject = myStream;
        
        if(!deviceId){
            await getCameras();
        };
    } catch(e) {
        console.log(e);
    }
};

getMedia();

function handleMuteClick() {                 //<-여기는 track.enabled에 새로운 값을 지정해주는거임
    myStream
    .getAudioTracks()
    .forEach((track) => track.enabled = !track.enabled)
    if(!muted){                                              //<-여기는 새로운 값에대한 반대값을 지정해줌
       muteBtn.innerText = "Unmute";
       muted = true; 
    } else {
        muteBtn.innerText = "Mute";
        muted = false;     
    }
};
function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled =!track.enabled));

    if(cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);
