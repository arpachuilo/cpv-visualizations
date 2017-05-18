function drawTranscriptDetails (transcripts) {
  var list = document.getElementById('transcripts')
  while (list.firstChild) {
    list.removeChild(list.firstChild)
  }

  for (var i = 0; i < transcripts.length; i++) {
    var li = document.createElement('li')
    li.textContent = transcripts[i].label
    list.appendChild(li)
  }
}
