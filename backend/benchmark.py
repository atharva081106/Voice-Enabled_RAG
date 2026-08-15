import requests
import time
import numpy as np
import os
import argparse

API_URL = "http://localhost:8000/api/voice/query"
AUDIO_FILE = "test.wav"

def run_benchmark(num_queries=10):
    if not os.path.exists(AUDIO_FILE):
        print(f"Audio file {AUDIO_FILE} not found. Please create a dummy test.wav file first.")
        # Create a dummy file if not exists
        with open(AUDIO_FILE, "wb") as f:
            f.write(b"dummy audio data")
            
    print(f"Starting benchmark with {num_queries} queries...")
    
    total_latencies = []
    stt_latencies = []
    retrieval_latencies = []
    reranking_latencies = []
    generation_latencies = []
    verification_latencies = []
    
    errors = 0
    refusals = 0
    
    for i in range(num_queries):
        start_time = time.time()
        try:
            with open(AUDIO_FILE, "rb") as f:
                files = {"audio": ("test.wav", f, "audio/wav")}
                data = {"session_id": f"bench_{i}"}
                response = requests.post(API_URL, files=files, data=data, timeout=30.0)
                
            if response.status_code == 200:
                res_data = response.json()
                
                if res_data.get("refused"):
                    refusals += 1
                
                lat = res_data.get("latency_ms", {})
                total_latencies.append(lat.get("total", 0))
                stt_latencies.append(lat.get("stt", 0))
                retrieval_latencies.append(lat.get("retrieval", 0))
                reranking_latencies.append(lat.get("reranking", 0))
                generation_latencies.append(lat.get("generation", 0))
                verification_latencies.append(lat.get("verification", 0))
                
            else:
                errors += 1
                print(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            errors += 1
            print(f"Request failed: {e}")
            
        print(f"Completed query {i+1}/{num_queries}")
        time.sleep(0.5) # small delay to avoid overwhelming the local server instantly
        
    print("\n--- Benchmark Results ---")
    print(f"Total Queries: {num_queries}")
    print(f"Errors: {errors} ({(errors/num_queries)*100:.1f}%)")
    print(f"Refusals: {refusals} ({(refusals/num_queries)*100:.1f}%)")
    
    if not total_latencies:
        print("No successful queries to calculate percentiles.")
        return
        
    def print_percentiles(name, data):
        p50 = np.percentile(data, 50)
        p70 = np.percentile(data, 70)
        p100 = np.percentile(data, 100)
        print(f"{name:15} | P50: {p50:6.1f}ms | P70: {p70:6.1f}ms | P100: {p100:6.1f}ms")

    print("\n--- Latency Percentiles ---")
    print_percentiles("STT", stt_latencies)
    print_percentiles("Retrieval", retrieval_latencies)
    print_percentiles("Reranking", reranking_latencies)
    print_percentiles("Generation", generation_latencies)
    print_percentiles("Verification", verification_latencies)
    print("-" * 55)
    print_percentiles("Total", total_latencies)
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run RAG latency benchmark.")
    parser.add_argument("-n", "--num", type=int, default=10, help="Number of queries to run")
    args = parser.parse_args()
    
    run_benchmark(args.num)
