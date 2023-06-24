async function fetchGreeting () {
    const response = await fetch('http://localhost:5000',{
        method:'post',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            query: 'query{greeting}'
        })
    })
    const {data} =  await response.json()
    return data.greeting
}

fetchGreeting().then((greeting)=>{
    document.getElementById('greeting').textContent = greeting;
})