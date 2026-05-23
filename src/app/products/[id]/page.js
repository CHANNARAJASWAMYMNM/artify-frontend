'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiRequest, formatCurrency } from '@/utils/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Star, MapPin, Store, Calendar, ArrowLeft, Plus, Minus, MessageSquare, AlertCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    const res = await apiRequest(`/products/${id}`);
    if (res.success) {
      setProduct(res.data.product);
      setReviews(res.data.reviews || []);
    } else {
      console.error('Failed to load product details:', res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    // Optional: direct to cart or show success toast
    router.push('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!comment) {
      setReviewError('Please write a review comment.');
      return;
    }

    setSubmittingReview(true);
    const res = await apiRequest(`/products/${id}/reviews`, {
      method: 'POST',
      body: { rating, comment }
    });

    if (res.success) {
      setReviewSuccess('Thank you! Your review has been added.');
      setComment('');
      setRating(5);
      // Reload product details to recalculate averages
      await fetchProductDetails();
    } else {
      setReviewError(res.error || 'Failed to submit review.');
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-clay-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-2xl mx-auto py-16 px-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="mt-4 text-xl font-bold font-serif text-gray-800">Product Not Found</h1>
          <p className="text-gray-500 mt-2">The craft you are looking for might have been deleted by the seller.</p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-clay-600 px-4 py-2 rounded-lg">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const alreadyReviewed = user && reviews.some(r => r.customer?._id === user._id || r.customer === user._id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Back navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-clay-600 mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to gallery
        </Link>

        {/* Product core specs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image */}
          <div className="bg-white border border-sand-200 rounded-3xl overflow-hidden shadow-sm aspect-square max-h-[500px]">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column: Information */}
          <div className="flex flex-col">
            {/* Category */}
            <span className="text-[10px] uppercase tracking-widest font-bold text-clay-700 bg-clay-50 border border-clay-200/50 px-3 py-1 rounded-full self-start mb-4">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Shop and Location */}
            <div className="flex items-center gap-2 text-sm mt-3 text-gray-500 border-b border-sand-200 pb-5">
              <span className="font-semibold text-clay-700 flex items-center gap-1 hover:underline">
                <Store className="h-4 w-4" />
                <Link href={`/artisan/${product.seller._id || product.seller}`}>
                  {product.shopName}
                </Link>
              </span>
              <span>•</span>
              <div className="flex items-center gap-0.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{product.location}</span>
              </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 mt-5">
              <div className="flex text-amber-500"><Star className="h-4 w-4 fill-current" /></div>
              <span className="text-sm font-bold text-gray-800">{product.averageRating || '0.0'}</span>
              <span className="text-xs text-gray-400">({product.reviewsCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex flex-col bg-sand-100 border border-sand-200 rounded-2xl p-5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price (Fair Trade)</span>
              <span className="text-3xl font-black text-gray-900 mt-1">{formatCurrency(product.price)}</span>
              
              {/* Stock Indicator */}
              <div className="mt-4 flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-green-700">In Stock ({product.stock} left)</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-xs font-semibold text-red-700">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Buy Controls */}
            {product.stock > 0 && (
              <div className="mt-8 flex items-center gap-4">
                {/* Quantity picker */}
                <div className="flex items-center border border-sand-300 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 hover:bg-sand-50 rounded-lg text-gray-500 hover:text-gray-800"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-gray-800 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="p-2 hover:bg-sand-50 rounded-lg text-gray-500 hover:text-gray-800"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-clay-600 hover:bg-clay-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all focus:outline-none"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Shopping Cart
                </button>
              </div>
            )}

            {/* Description */}
            <div className="mt-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-sand-200 pb-2">Description</h3>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-sans">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Storytelling Section */}
        <section className="mt-20 bg-sand-100 border border-sand-200 rounded-3xl p-8 sm:p-12 shadow-sm relative">
          <div className="absolute left-6 top-6 text-2xl font-serif italic text-clay-200 select-none">“</div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-[9px] uppercase tracking-widest font-bold text-clay-700 bg-clay-100 px-3 py-1 rounded-full border border-clay-200 self-center">
              The Artisan Story Behind the Craft
            </span>
            <h2 className="mt-6 text-2xl sm:text-3xl font-bold font-serif text-gray-900">
              How this piece was born
            </h2>
            <p className="mt-6 text-xs sm:text-sm text-gray-600 leading-relaxed italic font-serif">
              "{product.story}"
            </p>

            <div className="mt-8 border-t border-sand-200/50 pt-6 flex flex-col items-center">
              <p className="text-xs font-bold text-gray-700">{product.shopName}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Preserving traditional handmade legacies.</p>
              <Link
                href={`/artisan/${product.seller._id || product.seller}`}
                className="mt-4 text-xs font-bold text-clay-600 hover:text-clay-700 underline flex items-center gap-1"
              >
                Learn more about this artisan's journey <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-sand-200 pt-16">
          {/* Left: reviews list */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-clay-600" /> Customer Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-white border border-sand-200 rounded-2xl p-8 text-center text-xs text-gray-500">
                No reviews yet for this craft. Be the first to buy and share your experience!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="bg-white border border-sand-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{rev.customer?.email || 'Verified Buyer'}</p>
                        {/* Star rating */}
                        <div className="flex text-amber-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-gray-600 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Write a Review Form */}
          <div className="lg:col-span-5 bg-white border border-sand-200 rounded-2xl p-6 shadow-sm self-start">
            <h3 className="text-base font-bold font-serif text-gray-900 border-b border-sand-100 pb-3 mb-4">
              Write a Review
            </h3>

            {!user ? (
              <p className="text-xs text-gray-500 text-center py-6">
                Please{' '}
                <Link href="/auth/login" className="font-bold text-clay-600 hover:underline">
                  log in
                </Link>{' '}
                to submit a product review.
              </p>
            ) : user.role !== 'customer' ? (
              <p className="text-xs text-gray-500 text-center py-6">
                Reviews can only be submitted by customer accounts.
              </p>
            ) : alreadyReviewed ? (
              <p className="text-xs text-green-700 font-medium text-center py-6 bg-green-50 rounded-xl border border-green-100 px-4">
                ✓ You have already reviewed this creation. Thank you for your feedback!
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <p className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                    {reviewError}
                  </p>
                )}
                {reviewSuccess && (
                  <p className="p-2.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg font-medium">
                    {reviewSuccess}
                  </p>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className="p-1 hover:scale-110 transition-transform text-amber-500 focus:outline-none"
                      >
                        <Star className={`h-6 w-6 ${num <= rating ? 'fill-current' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Your Experience</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you like about the texture, finish, slow-cooked taste, or hand-weaving details..."
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600 text-xs text-gray-700 leading-relaxed"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-clay-600 hover:bg-clay-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all focus:outline-none"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
