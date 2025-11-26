import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function App() {
  const webcamRef = useRef(null);
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);
  const isProcessingRef = useRef(false); // Use ref to avoid dependency issues

  useEffect(() => {
    console.log('useEffect started - interval will run every 3 seconds');
    
    const interval = setInterval(async () => {
      console.log('Interval tick - checking conditions...');
      console.log('isProcessing:', isProcessingRef.current);
      console.log('webcamRef.current:', webcamRef.current);
      
      // Skip if already processing to prevent overlapping requests
      if (isProcessingRef.current || !webcamRef.current) {
        console.log('Skipping this interval');
        return;
      }

      const imageSrc = webcamRef.current.getScreenshot();
      console.log('Screenshot captured:', imageSrc ? 'Yes' : 'No');
      
      if (!imageSrc) {
        setError('Failed to capture image');
        return;
      }

      setIsProcessing(true);
      isProcessingRef.current = true;
      setError('');

      // Cancel previous request if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        console.log('Sending request to Go server...');
        const response = await axios.post(
          'http://localhost:8080/process',
          { image_base64: imageSrc },
          { 
            signal: abortControllerRef.current.signal,
            timeout: 10000 // Increased to 10 seconds
          }
        );
        console.log('Received response:', response.data);

        const newCaption = response.data.caption;
        console.log('Caption received:', newCaption);
        console.log('Current caption:', caption);
        
        if (newCaption) {
          setCaption(newCaption);
          console.log('Caption state updated');

          // Cancel any ongoing speech before starting new one
          window.speechSynthesis.cancel();
          
          // Small delay to ensure cancel completes
          setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(newCaption);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
            console.log('Speech started for:', newCaption);
          }, 100);
        } else {
          console.log('No caption in response');
        }
      } catch (err) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          console.log('Request cancelled');
          return;
        }
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.error || err.message || 'Processing failed');
      } finally {
        setIsProcessing(false);
        isProcessingRef.current = false;
      }
    }, 3000); // Increased to 3 seconds for better performance

    // Cleanup function
    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array - run once on mount

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>Live Image Captioning</h1>
      
      <div style={{ 
        display: 'inline-block', 
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          onUserMediaError={(err) => setError('Camera access denied')}
        />
        {isProcessing && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Processing...
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2 style={{ 
          color: error ? '#dc2626' : '#1f2937',
          minHeight: '40px'
        }}>
          {error ? `⚠️ ${error}` : caption ? `📷 ${caption}` : '👁️ Watching...'}
        </h2>
      </div>

      <p style={{ 
        color: '#6b7280', 
        fontSize: '14px',
        marginTop: '10px' 
      }}>
        Captions update every 3 seconds
      </p>
    </div>
  );
}

export default App;
