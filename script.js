const URL = "https://vbkhqmllqdaupduakkhy.supabase.co";
const KEY = "sb_publishable_5gZumduOCX0AmsyG1KQ8Kw_t7ScU4y2";
let supabaseClient;

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(URL, KEY);
        console.log("✅ Supabase initialized");
        fetchTasks();
        checkData();
    } else {
        setTimeout(initSupabase, 500);
    }
}

async function checkData() {
    if(!supabaseClient) return;
    const status = document.getElementById('status');
    const { error } = await supabaseClient.from('tasks').select('*').limit(1);
    if (error) {
        status.innerText = "Error: " + error.message;
        status.className = "alert alert-danger py-2 small";
    } else {
        status.innerText = "Connected!";
        status.className = "alert alert-success py-2 small";
    }
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const status = document.getElementById('status');
    const taskValue = input.value.trim();
    if (!taskValue || !supabaseClient) return;
    const { error } = await supabaseClient.from('tasks').insert([{ title: taskValue }]);
    if (error) {
        status.innerText = "Error: " + error.message;
        status.className = "alert alert-danger py-2 small";
    } else {
        status.innerText = "Saved!";
        status.className = "alert alert-success py-2 small";
        input.value = "";
        fetchTasks();
    }
}

async function fetchTasks() {
    if(!supabaseClient) return;
    const taskList = document.getElementById('taskList');
    const { data, error } = await supabaseClient.from('tasks').select('*').order('created_at', { ascending: false });
    if (!error) {
        taskList.innerHTML = "";
        data.forEach(task => {
            const li = document.createElement('li');
            li.className = "list-group-item bg-dark text-white mb-2 border-secondary rounded shadow-sm";
            li.innerText = task.title;
            taskList.appendChild(li);
        });
    }
}

// सुरवात करा
initSupabase();
