#!/bin/bash

echo "🐳 Testing Docker Build for Invoice Generator Backend"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t invoice-generator-backend .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    
    echo "🚀 Starting container for testing..."
    docker run -d --name test-backend -p 5000:5000 \
        -e NODE_ENV=development \
        -e PORT=5000 \
        -e SESSION_SECRET=test-secret \
        invoice-generator-backend
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully!"
        echo "🌐 Backend should be running at: http://localhost:5000"
        echo "⏳ Waiting 10 seconds for the app to start..."
        sleep 10
        
        # Test health endpoint
        echo "🔍 Testing health endpoint..."
        if curl -f http://localhost:5000/ > /dev/null 2>&1; then
            echo "✅ Health check passed! Backend is running correctly."
        else
            echo "⚠️  Health check failed. Checking logs..."
            docker logs test-backend
        fi
        
        echo ""
        echo "🧹 Cleaning up test container..."
        docker stop test-backend
        docker rm test-backend
        echo "✅ Test completed!"
        
    else
        echo "❌ Failed to start container"
        exit 1
    fi
    
else
    echo "❌ Docker build failed!"
    exit 1
fi


echo "🎉 Docker file is ready for deployment to Render!"
echo "📖 Check RENDER_DEPLOYMENT.md for deployment instructions"
