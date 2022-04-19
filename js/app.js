let count = 0;
let right_answrs = 0;
const request = new XMLHttpRequest();
request.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    const data = JSON.parse(request.responseText).question;

    query('.progress').dataset.q = data.length
    render(data[count], data.length);
    query('.submit').onclick = () => {
      if (count < data.length) {
        let correct = data[count].correct.toString();
        count++;
        check(correct, data.length);
        query('.area').textContent = '';
        query('.answers').textContent = '';
        render(data[count], data.length);
      }
    }
  }
}
request.open('GET', 'js/data.json', true);
request.send();

function query(element) { return document.querySelector(element) }

function render(data, total) {
  if (count < total) {
    query('.progress span').dataset.current = count + 1;
    let q = document.createElement('h2');
    q.appendChild(document.createTextNode(data.q))
    query('.area').appendChild(q);
    for (let i = 1; i <= 4; i++) {
      let answer = document.createElement('div');
      answer.className = `answer_${i}`;
      let label = document.createElement('label');
      label.htmlFor = `answer_${i}`;
      let input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.id = `answer_${i}`;
      // randomly answers 
      let r = Math.floor(Math.random() * data.a.length);
      let index = data.a.indexOf(data.a[r]);
      let s = data.a.splice(index, 1)
      input.dataset.answer = s;
      label.appendChild(document.createTextNode(s));
      answer.appendChild(input);
      answer.appendChild(label);
      query('.answers').appendChild(answer);
      // if (i == 1) input.checked = true;
    }
  }
}

function check(right, total) {
  let answers = Array.from(document.querySelectorAll('[name=answer]'));
  let choice = answers.filter(ch => ch.checked === true)
    .map(m => m.dataset.answer).join('');

  if (right === choice) {
    right_answrs++;
    let per = right_answrs * 100 / total;
    query('.progress span').style.width = `${per}%`;
  }

  if (count === total) {
    let r = document.createElement('h2');
    r.textContent = `Your have a ${right_answrs} from ${total}`;
    setTimeout(() => query('.area').appendChild(r), 100);
  }

}
