// src/components/ErrorBoundary.jsx
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // In ra console để debug nhanh
    // eslint-disable-next-line no-console
    console.error('[App ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-semibold mb-2">Đã xảy ra lỗi khi hiển thị trang</h1>
          <p className="text-gray-600 mb-3">Xem Console (F12) để biết chi tiết.</p>
          <pre className="bg-gray-100 text-sm p-3 rounded overflow-auto">
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
