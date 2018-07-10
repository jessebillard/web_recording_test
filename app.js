const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const mainSection = document.querySelector('.main-controls');

stop.disabled = true;

if (navigator.mediaDevices.getUserMedia) {
    let chunks = [];
    let constraints = { audio: true }

    const onSuccess = function(stream) {
        const mediaRecorder = new MediaRecorder(stream)

        record.onclick = function() {
            mediaRecorder.start();
            record.style.background = 'red';
            stop.disabled = false;
            record.disabled = true;
        }

        stop.onclick = function() {
            mediaRecorder.stop();
            record.style.background = '';
            record.style.color = '';
            stop.disabled = true;
            record.disabled = false;
        }

        mediaRecorder.onstop = function(e) {
            const clipName = prompt("Enter a name for your PURE HEAT!", "my unnamed clip")
            const clipContainer = document.createElement('article');
            const clipLabel = document.createElement('p');
            const audio = document.createElement('audio');
            const deleteButton = document.createElement('button');

            clipContainer.classList.add('clip')
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            clipLabel.textContent = clipName;

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            audio.controls = true;
            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;

            deleteButton.onclick = function(e) {
                deleteBtn = e.target;
                deleteBtn.parentNode.parentNode.removeChild(deleteBtn.parentNode);
              }

        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }

    }

    const onError = function(error) {
        alert('the following error occurred:' + error)
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(onSuccess, onError);

} else {
    alert('getUserMedia is not supported on you browser!')
}