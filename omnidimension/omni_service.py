from flask import Flask, request, jsonify
from omnidimension import Client

app = Flask(__name__)

# Your API Key + agent_id
api_key = "AmnVBZQ-plE4pkTbnh33jvwj7tok5kGS6A26SMJJRmk"
agent_id = 1859

client = Client(api_key)

@app.route('/dispatch_call', methods=['POST'])
def dispatch_call():
    data = request.get_json()
    to_number = data.get('to_number')
    task_text = data.get('task')

    print(f"Dispatching call to {to_number} for task: {task_text}")

    try:
        call_context = {
    "customer_name": "John Doe",
    "account_id": "ACC-12345",
    "priority": "high",
    "task": task_text
}


        response = client.call.dispatch_call(agent_id, to_number, call_context)

        print("Call dispatched!")
        print(response)

        return jsonify({"status": "success", "response": response}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='localhost', port=5050)
