from flask import Flask, request, jsonify
from omnidimension import Client

app = Flask(__name__)

# Your API Key + agent_id
api_key = "AmnVBZQ-plE4pkTbnh33jvwj7tok5kGS6A26SMJJRmk"
agent_id = 1859

client = Client(api_key)

@app.route('/dispatch_call', methods=['POST'])
def dispatch_call():
    data = request.json
    agent_id = data.get('agent_id')
    task_text = data.get('input_text')

    print(f"Dispatching call to agent_id={agent_id} for task: {task_text}")

    if not agent_id or not task_text:
        return jsonify({'message': 'Missing agent_id or input_text', 'status': 'error'}), 400

    try:
        # Dispatch the call
        response = client.call.dispatch_call(agent_id, "+19302019007", {"task": task_text})


        print(f"Omnidimension API response: {response}")

        return jsonify({'message': 'Call dispatched successfully!', 'status': 'success'})
    except Exception as e:
        print(f"Error dispatching call: {e}")
        return jsonify({'message': str(e), 'status': 'error'}), 500


if __name__ == '__main__':
    app.run(host='localhost', port=5050)
