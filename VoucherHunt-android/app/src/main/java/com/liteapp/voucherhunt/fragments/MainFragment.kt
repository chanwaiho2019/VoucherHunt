package com.liteapp.voucherhunt.fragments

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.appbar.AppBarLayout
import com.liteapp.voucherhunt.R
import com.liteapp.voucherhunt.VoucherDetailActivity
import com.liteapp.voucherhunt.adapters.VoucherListAdapter
import com.liteapp.voucherhunt.core.CoreManager
import com.liteapp.voucherhunt.models.Voucher
import com.liteapp.voucherhunt.presenters.VoucherListPresenterImpl
import com.liteapp.voucherhunt.view.MainView
import com.liteapp.voucherhunt.view.VoucherListView
import kotlinx.android.synthetic.main.fragment_main.*
import kotlinx.android.synthetic.main.fragment_main.view.*


// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [MainFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class MainFragment : Fragment(), MainView, VoucherListView{
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null


    private lateinit var recyclerView: RecyclerView
    private lateinit var viewAdapter: RecyclerView.Adapter<*>
    private lateinit var viewManager: RecyclerView.LayoutManager
    private lateinit var voucherListPresenter:VoucherListPresenterImpl

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            param1 = it.getString(ARG_PARAM1)
            param2 = it.getString(ARG_PARAM2)
        }



    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_main, container, false)
        (activity as AppCompatActivity?)!!.setSupportActionBar(toolbar)
//        rootView.appBar.addOnOffsetChangedListener(AppBarLayout.OnOffsetChangedListener { appBarLayout, verticalOffset ->
//            if (collapsingToolbar.getHeight() + verticalOffset < 2 * ViewCompat.getMinimumHeight(
//                    collapsingToolbar
//                )
//            ) {
//                toolbar.titleTxt.setTextColor(resources.getColor(R.color.black))
//                toolbar.searchBtn.setColorFilter(ContextCompat.getColor(activity as AppCompatActivity, R.color.black));
//                toolbar.filterBtn.setColorFilter(ContextCompat.getColor(activity as AppCompatActivity, R.color.black));
//            } else {
//                toolbar.titleTxt.setTextColor(resources.getColor(R.color.white))
//                toolbar.searchBtn.setColorFilter(ContextCompat.getColor(activity as AppCompatActivity, R.color.white));
//                toolbar.filterBtn.setColorFilter(ContextCompat.getColor(activity as AppCompatActivity, R.color.white));
//            }
//        })
        CoreManager.getInstance().updateSavedVoucher()

        voucherListPresenter = VoucherListPresenterImpl(activity as AppCompatActivity, this)
        voucherListPresenter.loadVouhcers()

        viewManager = LinearLayoutManager(activity as AppCompatActivity)
        viewAdapter = VoucherListAdapter(voucherListPresenter.data, activity as AppCompatActivity, voucherListPresenter)
        recyclerView = rootView.recyclerView.apply {
            setHasFixedSize(true)
            layoutManager = viewManager
            adapter = viewAdapter
        }

        return rootView
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment MainFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            MainFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }

    override fun updateVouchers() {

        viewAdapter.notifyDataSetChanged()
    }

    override fun openVoucherDetail(voucher: Voucher) {

        val intent = Intent(activity, VoucherDetailActivity::class.java).apply {
            putExtra("voucher", voucher)
        }
        this.startActivity(intent)
        activity!!.overridePendingTransition(R.animator.fade_in, R.animator.fade_out)
    }

    override fun onResume() {
        super.onResume()
        updateVouchers()
    }
}